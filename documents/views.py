from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from documents.forms import NsDocumentForm


class DocumentTableView(LoginRequiredMixin, TemplateView):
    template_name = 'documents/angularjs/partials/documentsTableNgTable.html'


class DocumentFormView(LoginRequiredMixin, TemplateView):
    template_name = 'documents/angularjs/partials/documentForm.html'


class DocumentFormCrispyView(FormView):
    template_name = 'documents/angularjs/partials/documentForm.html'
    form_class = NsDocumentForm
    success_url = 'nsdocuments:table'

    def form_valid(self, form):
        return super(DocumentFormCrispyView, self).form_invalid(form)
