class TradovateError(Exception):
    def __init__(self, message: str, status_code: int | None = None, response_body: str | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


class AuthenticationError(TradovateError):
    pass


class RateLimitError(TradovateError):
    def __init__(self, message: str = "Rate limited by Tradovate", retry_after: float | None = None, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class OrderError(TradovateError):
    pass


class AccountError(TradovateError):
    pass
