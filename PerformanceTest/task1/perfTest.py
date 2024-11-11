from locust import HttpUser, task, between
import random
import string
def generate_random_data():
    return {
        'fullName': ''.join(random.choices(string.ascii_letters, k=10)),
        'userName': ''.join(random.choices(string.ascii_letters, k=8)),
        'email': f"{''.join(random.choices(string.ascii_letters, k=8))}@test.com",
        'password': ''.join(random.choices(string.ascii_letters + string.digits, k=10)),
        'phone': ''.join(random.choices(string.digits, k=10))
    }
class LoadTestUser(HttpUser):
    wait_time = between(1, 3)
    
    # Load testing for client_registeration
    @task
    def test_client_register(self):
        data = generate_random_data()
        self.client.post("/client_registeration", data=data)
class StressTestUser(HttpUser):
    wait_time = between(1, 2)
    
    # Stress testing for client_login
    @task
    def test_client_login(self):
        data = {
            'userName': ''.join(random.choices(string.ascii_letters, k=8)),
            'email': f"{''.join(random.choices(string.ascii_letters, k=8))}@test.com",
            'password': ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        }
        self.client.post("/client_login", data=data)
class BDDTestUser(HttpUser):
    wait_time = between(1, 2)
    
    def on_start(self):
        self.test_data = generate_random_data()
    
    @task
    def scenario_register_then_login(self):
        # Step 1: Register a new user
        with self.client.post("/client_registeration", data=self.test_data, catch_response=True) as response:
            if response.json()['msg'] == 'User Registered':
                response.success()
            else:
                response.failure("Registration failed")
        
        # Step 2: Login with the registered user
        login_data = {
            'userName': self.test_data['userName'],
            'email': self.test_data['email'],
            'password': self.test_data['password']
        }
        with self.client.post("/client_login", data=login_data, catch_response=True) as response:
            if 'token' in response.json():
                response.success()
            else:
                response.failure("Login failed")