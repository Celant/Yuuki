from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer

class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)

        return Response({'token': token.key})
        
obtain_auth_token = ObtainAuthToken.as_view()

class Test(APIView):
    
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        return Response({'test':'true', 'username': request.user.username})