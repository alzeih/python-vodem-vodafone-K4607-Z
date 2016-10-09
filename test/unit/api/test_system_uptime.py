import unittest

from vodem.api import system_uptime


class TestSystemUptime(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'system_uptime': '',
        }

    def test_call(self):
        resp = system_uptime()
        resp['system_uptime'] = ''
        self.assertEqual(self.valid_response, resp)
