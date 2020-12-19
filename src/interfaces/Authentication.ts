export default interface AuthenticationInterface {
  login(username: string, password: string): Promise<void>
  removeModals(): Promise<void>
}