class VodemError(Exception):
    pass


class RequestsError(VodemError):
    pass


class DecodeError(VodemError):
    pass


class InputError(VodemError):
    pass
