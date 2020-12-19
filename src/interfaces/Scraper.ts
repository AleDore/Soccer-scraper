export default interface ScraperInterface {
  scrapeInstagram(page): Promise<void>
}