from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound
from django.urls import reverse
from django.template.loader import render_to_string

def index(requests) -> HttpResponse:
    data = {'menu': [{'id': 1, 'name': 'Python'},
                    {'id': 2, 'name': 'SQL'},
                    {'id': 3, 'name': r'C/C++'},
                    {'id': 4, 'name': 'JavaScript'},
                    {'id': 5, 'name': 'Django'},
                    {'id': 6, 'name': 'Python'},
                    ]
        }
    # t = render_to_string('notes/index.html')
    # return HttpResponse(t)
    return render(requests, 'notes/index.html', data)

def categories(requests, cat_id: int) -> HttpResponse:
    return HttpResponse( f'<h1>Категория {cat_id}</h1>')

def page_not_found(requests, exception) -> HttpResponseNotFound:
    '''Переназначает ошибку 404.
       В urls.py самого сайта, то есть не django/mynotes/notes/urls.py, а django/mynotes/mynotes/urls.py
       переменную handler404 инициализируем функциеи которую хотим вызывать при возбуждение ошибки 404.
       Так же мы можем переназначить и остальные ошибки, перечень всех переменных:
       	handler500 – ошибка сервера;
		handler403 – доступ запрещен;
		handler400 – невозможно обработать запрос;
        handler404 – страница не найдена.'''
    return HttpResponseNotFound("<h1>Страница не найдена</h1>")



