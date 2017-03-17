from django.conf.urls import url
from django.contrib.auth.views import logout_then_login, login
from django.views.generic.base import TemplateView

from . import views

urlpatterns = [
    url(r'^login', login, name='login'),
    url(r'^logout', logout_then_login, name='logout'),
    url(r'^partials/documents/table', views.DocumentTableView.as_view(), name='table'),
    url(r'^partials/documents/form', views.DocumentFormView.as_view(), name='form'),
    url(r'^', TemplateView.as_view(template_name="documents/documents.html"), name='home'),
]
