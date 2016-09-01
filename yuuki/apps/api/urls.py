from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'authenticate$', views.obtain_auth_token),
    url(r'test$', views.Test.as_view(), name='test'),
]
