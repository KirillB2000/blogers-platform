import { blogInputModel } from "../../../src/blogs/dto/blogInputModel";


export const blogDto = (): blogInputModel => {
    return {
        name: 'Test name',
        description: 'Test description',
        websiteUrl: 'https://example.com'
    }
}