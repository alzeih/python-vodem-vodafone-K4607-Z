import unittest

from vodem.api import cell_id


class TestCellId(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.valid_response = {
            'cell_id': '0'
        }

    def test_call(self):
        resp = cell_id()
        self.assertEqual(self.valid_response, resp)
