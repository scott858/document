from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from documents.models import NsDocumentRevision


class NsDocumentRevisionForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(NsDocumentRevisionForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_id = 'id-documentForm'
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('save', 'save'))

    class Meta:
        model = NsDocumentRevision
        fields = ('project', 'document_type',
                  'concise_description', 'verbose_description',
                  'document_format')
