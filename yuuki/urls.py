"""MPUKstatus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.contrib.staticfiles.views import serve as serve_static
from django.views.decorators.cache import never_cache

from yuuki.apps.yuuki import views

urlpatterns = [
    url(r'^$', views.Index.as_view(), name='index'),
    url(r'^api/', include('yuuki.apps.api.urls')),
    url(r'^admin/', include('yuuki.apps.yuuki.urls')),
    url(r'^admin/django/', admin.site.urls),
    url(r'^static/(?P<path>.*)$', never_cache(serve_static)),
    url(r'^', include('yuuki.apps.yuuki.urls')),
] #+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)