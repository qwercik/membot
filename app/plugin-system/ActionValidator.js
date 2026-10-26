import ApplicationError from '#app/exceptions/ApplicationError.js'
import language from '#app/language/index.js'

function validate (action) {
  const requirements = !!action.getName()

  if (!requirements) {
    throw new ApplicationError(language('action_incorrect_error'))
  }
}

export default { validate }
