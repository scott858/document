from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^documents/$', views.NsDocumentListReadOnlyView.as_view(), name='documents'),
    url(r'^documents/revisions/$', views.NsDocumentRevisionReadOnlyListView.as_view(), name='revisions'),
    url(r'^documents/types/$', views.NsDocumentTypeListCreateView.as_view(), name='document_types'),
    url(r'^documents/formats/$', views.NsDocumentFormatListCreateView.as_view(), name='document_formats'),
    url(r'^projects/$', views.NsProjectListCreateView.as_view(), name='projects'),
    url(r'api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
