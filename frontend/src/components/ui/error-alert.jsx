import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, X } from 'lucide-react'
import { getErrorMessage } from '@/lib/errorMessages'

/**
 * ErrorAlert component - displays user-friendly error messages
 * @param {object} props
 * @param {Error|string|object} props.error - The error to display
 * @param {string} props.context - The context (auth, signup, notes, general)
 * @param {function} props.onDismiss - Optional callback to dismiss the alert
 * @param {string} props.className - Optional additional classes
 */
export function ErrorAlert({ error, context = 'general', onDismiss, className = '' }) {
  if (!error) return null;

  const { title, description } = getErrorMessage(error, context);

  return (
    <Alert variant="destructive" className={`relative ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-destructive/20 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
}

/**
 * SuccessAlert component - displays success messages
 * @param {object} props
 * @param {string} props.title - The title of the alert
 * @param {string} props.description - The description
 * @param {function} props.onDismiss - Optional callback to dismiss the alert
 * @param {string} props.className - Optional additional classes
 */
export function SuccessAlert({ title, description, onDismiss, className = '' }) {
  if (!title && !description) return null;

  return (
    <Alert className={`relative border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-green-500/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
}

/**
 * InfoAlert component - displays info messages
 * @param {object} props
 * @param {string} props.title - The title of the alert
 * @param {string} props.description - The description
 * @param {function} props.onDismiss - Optional callback to dismiss the alert
 * @param {string} props.className - Optional additional classes
 */
export function InfoAlert({ title, description, onDismiss, className = '' }) {
  if (!title && !description) return null;

  return (
    <Alert className={`relative border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-blue-500/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
}
