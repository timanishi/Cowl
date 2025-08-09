export interface AppError {
  message: string
  code?: string
  statusCode?: number
}

export class CowlError extends Error {
  code: string
  statusCode: number

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500) {
    super(message)
    this.name = 'CowlError'
    this.code = code
    this.statusCode = statusCode
  }
}

export const errorMessages = {
  // Authentication errors
  UNAUTHORIZED: 'ログインが必要です',
  INVALID_SESSION: 'セッションが無効です',
  
  // Wallet errors
  WALLET_NOT_FOUND: 'ウォレットが見つかりません',
  WALLET_ACCESS_DENIED: 'このウォレットにアクセスする権限がありません',
  WALLET_MEMBER_NOT_FOUND: 'メンバーが見つかりません',
  
  // Payment errors
  PAYMENT_NOT_FOUND: '支払い記録が見つかりません',
  INVALID_PAYMENT_AMOUNT: '無効な金額です',
  PAYMENT_PARTICIPANTS_MISMATCH: '参加者の合計金額が一致しません',
  
  // Settlement errors
  SETTLEMENT_NOT_FOUND: '精算記録が見つかりません',
  SETTLEMENT_CALCULATION_ERROR: '精算計算でエラーが発生しました',
  
  // Network errors
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  
  // Validation errors
  VALIDATION_ERROR: '入力内容に不備があります',
  REQUIRED_FIELD_MISSING: '必須項目が入力されていません',
  
  // Generic errors
  UNKNOWN_ERROR: '不明なエラーが発生しました',
  OPERATION_FAILED: '操作に失敗しました'
} as const

export function getErrorMessage(error: any): string {
  if (error instanceof CowlError) {
    return errorMessages[error.code as keyof typeof errorMessages] || error.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return errorMessages.UNKNOWN_ERROR
}

export function handleApiError(error: any): AppError {
  console.error('API Error:', error)
  
  if (error instanceof CowlError) {
    return {
      message: getErrorMessage(error),
      code: error.code,
      statusCode: error.statusCode
    }
  }
  
  // Handle fetch errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      message: errorMessages.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
      statusCode: 0
    }
  }
  
  // Handle HTTP errors
  if (error.status) {
    switch (error.status) {
      case 401:
        return {
          message: errorMessages.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
          statusCode: 401
        }
      case 403:
        return {
          message: errorMessages.WALLET_ACCESS_DENIED,
          code: 'ACCESS_DENIED',
          statusCode: 403
        }
      case 404:
        return {
          message: '要求されたリソースが見つかりません',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      case 500:
        return {
          message: errorMessages.SERVER_ERROR,
          code: 'SERVER_ERROR',
          statusCode: 500
        }
      default:
        return {
          message: errorMessages.UNKNOWN_ERROR,
          code: 'UNKNOWN_ERROR',
          statusCode: error.status
        }
    }
  }
  
  return {
    message: getErrorMessage(error),
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  }
}