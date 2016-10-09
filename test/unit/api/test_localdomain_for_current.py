import unittest

from vodem.api import localdomain_for_current


class TestLocaldomainForCurrent(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'LocalDomain_for_current': 'vodafonemobile.wifi',
        }

    def test_call(self):
        resp = localdomain_for_current()
        self.assertEqual(self.valid_response, resp)
