import time, json
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(3, 5)

    @task(1)
    def api_page(self):
        form_data = {
            'userName': 'JohnDoe',
            'email': 'john@outlook.coma',
            'password' : '123456'
        }

        headers = {"Content-Type": "multipart/form-data"}

        response = self.client.post(
            "/client_login",
            data=form_data,
            headers=headers
        )