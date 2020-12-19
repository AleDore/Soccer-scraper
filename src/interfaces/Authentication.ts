export default interface AuthenticationInterface {
 login(page: any, username: string, password: string): Promise<void>
}