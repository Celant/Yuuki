from django.http import Http404
from django.db.models import Sum
from django.utils import timezone

from rest_framework import mixins, generics, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from yuuki.apps.api.models import Server, ServerProvider, ServerStats

import urlparse, hashlib, json

# Create your views here.

class SubmitView(APIView):
    """
    Submit data to the server
    """

    def get_object(self, provider_id):
        try:
            return ServerProvider.objects.get(provider_token=provider_id)
        except:
            return None
            
    """
    This is ONLY ever used for legacy servers, for which we generate their GUID
    from a MD5 hash of their IP address and port number
    """
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get(self, request, encoded, format=None):
        decoded = urlparse.unquote(encoded)
        data = json.loads(decoded)
        
        server = Server()
        
        if ('serverId' in data):
            server.is_legacy = False
        else:
            server.is_legacy = True
        
        if (not server.is_legacy):
            server.fingerprint = data['serverId']
            server.port = data['port']
            server.tshock_version = data['version']
            server.terraria_version = data['terrariaVersion']
            
            if (data['providerId']):
                server.provider = self.get_object(data['providerId'])
            else:
                server.provider = None
        else:
            m = hashlib.md5()
            m.update(self.get_client_ip(request) + ":" + str(data['port']))
            
            server.fingerprint = m.hexdigest()
            server.port = data['port']
            server.provider = None
            server.tshock_version = data['version']
            server.terraria_version = data['terrariaVersion']
        
        server.last_updated = timezone.now
        server.save()
        
        stats = ServerStats()
        
        stats.server = server
        stats.cur_players = data['currentPlayers']
        stats.max_players = data['maxPlayers']
        stats.memory = data['systemRam']
        
        stats.save()
        
        
        return Response({'success': True})
        
class CurrentPlayersView(APIView):
    """
    Gets the current players
    """
    
    def get(self, request, format=None):
        sortedstats = ServerStats.objects.order_by('server').values('server').distinct()
        totalplayers = ServerStats.objects.values('server', 'added_at').annotate(pcount=Sum('cur_players')).order_by('added_at')
        maxplayers = sortedstats.aggregate(Sum('max_players'))
        
        #response = {
        #    'cur_players': currentplayers['cur_players__sum'],
        #    'max_players': maxplayers['max_players__sum']
        #}
        
        return Response(totalplayers)