interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}

export function LoadingButton({ children, loading, disabled, ...props }: any) {
  return (
    <button 
      {...props}
      disabled={disabled || loading}
      className={`${props.className} ${loading ? 'opacity-75 cursor-not-allowed' : ''} flex items-center justify-center`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
          読み込み中...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="読み込み中..." />
    </div>
  )
}