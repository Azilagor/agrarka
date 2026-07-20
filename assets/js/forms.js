/*
  forms.js
  Generic, reusable content-page interactivity used across several static
  pages: accessible client-side form validation (no backend anywhere on
  this site — forms show a local success message and reset) and a plain
  FAQ accordion. Both operate on markup conventions, not page-specific IDs,
  so the same file works on contacts.html, admissions.html, etc.
*/

(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+0-9()\-\s]{6,20}$/;

  function fieldLabelText(field) {
    var wrap = field.closest('.form-field');
    var label = wrap ? wrap.querySelector('label') : null;
    return label ? label.textContent.replace('*', '').trim() : 'Поле';
  }

  function setError(field, message) {
    var errorEl = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) {
      errorEl.textContent = message || '';
    }
  }

  function validateField(field) {
    var value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      setError(field, 'Заполните поле «' + fieldLabelText(field) + '»');
      return false;
    }
    if (value && field.type === 'email' && !EMAIL_RE.test(value)) {
      setError(field, 'Введите корректный адрес электронной почты');
      return false;
    }
    if (value && field.type === 'tel' && !PHONE_RE.test(value)) {
      setError(field, 'Введите корректный номер телефона');
      return false;
    }
    if (value && field.hasAttribute('minlength') && value.length < Number(field.getAttribute('minlength'))) {
      setError(field, 'Минимум ' + field.getAttribute('minlength') + ' символов');
      return false;
    }
    setError(field, '');
    return true;
  }

  function initForm(form) {
    var fields = form.querySelectorAll('.form-control');
    var successEl = form.querySelector('[data-form-success]');

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      if (successEl) {
        successEl.hidden = false;
        successEl.setAttribute('tabindex', '-1');
        successEl.focus();
      }
      form.reset();
      fields.forEach(function (field) {
        setError(field, '');
      });
    });
  }

  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(initForm);
  }

  function initFaq() {
    document.querySelectorAll('.faq-item__question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var answer = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', String(!expanded));
        if (answer) {
          answer.hidden = expanded;
        }
      });
    });
  }

  function init() {
    initForms();
    initFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
