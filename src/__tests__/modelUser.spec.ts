import { User } from '@model/User'

test('Test model User', () => {
  const user = new User('Fernando Gurgel', 'M', '15/05/1993')
  expect(user.fullName).toEqual('Fernando Gurgel')
  expect(28).toEqual(user.getAge())
})
