import { getReqspecFiles } from "./polarion-generator"

describe('getReqspecFiles', () => {

    test('example-nonrecursive', () => {

        const filepaths = getReqspecFiles('./examples', undefined, false)
    
        expect(filepaths.length).toBe(5)
    
        filepaths.forEach(filepath => {
            filepath.toString().endsWith('.reqspec')
        })
    })
    
    test('example-recursive', () => {
    
        const filepaths = getReqspecFiles('./examples', undefined, true)
    
        expect(filepaths.length).toBe(6)
    
        filepaths.forEach(filepath => {
            filepath.toString().endsWith('.reqspec')
        })
    })
    
    test('example-recursive-omit', () => {
        
        const pattern = '.*derp.*'
        const filepaths = getReqspecFiles('./examples', pattern, true)

        expect(filepaths.length).toBe(5)
        expect(filepaths.join(', ')).not.toMatch(pattern)
    
        filepaths.forEach(filepath => {
            filepath.toString().endsWith('.reqspec')
        })
    })
})

