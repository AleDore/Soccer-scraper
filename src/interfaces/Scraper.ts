import { InstagramResponse } from "./Responses";

export default interface ScraperInterface {
  scrapeInstagram(): Promise<InstagramResponse[]>
}