from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import RedirectView


class NsDocumentsRedirectView(LoginRequiredMixin, RedirectView):
    pattern_name = 'documents:home'
