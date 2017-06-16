from django.conf.urls import url

from yuuki.apps.api.views import (
    SubmitView,
    CurrentPlayersView
)

urlpatterns = [
    url(r'submit/(?P<encoded>.*)$', SubmitView.as_view(), name='submit'),
    url(r'publish/(?P<encoded>.*)$',SubmitView.as_view(), name='submit'),
    url(r'stats/currentplayers$',CurrentPlayersView.as_view(), name='submit'),
    
]
