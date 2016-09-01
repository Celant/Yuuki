from django.views.generic import TemplateView
from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login

from rest_framework.response import Response
from rest_framework.views import APIView

class Index(TemplateView):
    def get(self, request):
        return render_to_response('yuuki/index.html')

class Overview(TemplateView):
    
    def get(self, request):
        user = authenticate(username='test123', password='THISISATEST')
    
        if user is not None:
            if user.is_active:
                login(request, user)
                print("authenticated Yo")
            else:
                print("D154bl3d 4cc0unt")
        else:
            print("invalid L0g1n")
        
        return render_to_response('yuuki/overview.html')                
        