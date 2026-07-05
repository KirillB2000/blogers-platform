import { blogInputModel } from "../../../src/blogs/dto/blogInputModel";


export const getBlogDto = (): blogInputModel => {
    return {
        name: 'Test name',
        description: 'Test description',
        websiteUrl: 'https://example.com'
    }
}