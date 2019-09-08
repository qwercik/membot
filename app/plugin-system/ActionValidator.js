import ApplicationError from 'app/exceptions/ApplicationError'
import language from 'app/language'

function validate (action) {
  const requirements = !! action.getName()

  if (!requirements) {
    throw new ApplicationError(language('action_incorrect_error'))
  }
}

export default { validate }