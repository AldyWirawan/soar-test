load test command (task 1)
locust -f perfTest.py --class-picker LoadTestUser --host=http://127.0.0.1:5000 --users 25 --spawn-rate 25 --run-time 1m --headless --html=task1.html           

stress test command (task 2)
locust -f perfTest.py --class-picker StressTestUser --host=http://127.0.0.1:5000 --users 100 --spawn-rate 100 --run-time 1m --headless --html=task2.html

BDD test (task 3)
locust -f perfTest.py --class-picker BDDTestUser --host=http://127.0.0.1:5000 --users 50 --spawn-rate 50 --run-time 1m --headless --html=task3.html

on task 3, lot of fail on registration section when both api hit together at the same time

for CI CD integration for BDD test,

run_performance_tests.sh
-------------------------
echo "Running BDD tests..."
locust -f perfTest.py --class-picker BDDTestUser --host=http://127.0.0.1:5000 --users 50 --spawn-rate 50 --run-time 10m --headless --html=bdd_test_report.html