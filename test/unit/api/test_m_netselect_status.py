import unittest

from vodem.api import m_netselect_status


class TestMNetselectStatus(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'm_netselect_status': '',
        }

    def test_call(self):
        resp = m_netselect_status()
        resp['m_netselect_status'] = ''
        self.assertEqual(self.valid_response, resp)
