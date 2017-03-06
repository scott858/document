from django.conf.urls import include, url
from django.contrib import admin
import api.views
from . import views

urlpatterns = [
    url(r'api/v1/', include('api.urls', namespace='api')),
    url(r'^$', views.NsDocumentsRedirectView.as_view(), name='redirect'),
    url(r'^jet/', include('jet.urls', 'jet')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'nsdocuments/', include('documents.urls', namespace='documents'))
]
