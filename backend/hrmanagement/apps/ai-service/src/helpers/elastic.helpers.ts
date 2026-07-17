import { Client } from "@elastic/elasticsearch";

export const elastic = new Client({
    node: process.env.ELASTIC_URL
});


export type ElasticDocumentType  = {id:string,kind:string,embedding:any};

export type ElasticDocumentResult  = {id:string,kind:string,score:number | null | undefined};

export async function CreateIndex() : Promise<boolean>{
    const indexName = process.env.INDEX_NAME ?? "documents"

    const indices = await elastic.indices.create({
        index:indexName,
        mappings:{
            properties:{
                kind:{
                    type:"text"
                },
                createdAt:{
                    type:"text"
                },
                updatedAt:{
                    type:"text"
                },
                embedding:{
                            type:"dense_vector",
                            dims:1024,
                            index:true,
                            similarity:"cosine"
                        }
                    }
                }
                
        });

    if(indices.acknowledged) return true;

    return false;

}


export async function CreateEmbedIndex(document: ElasticDocumentType ): Promise<boolean> {
    
    const indexName = process.env.INDEX_NAME ?? "documents"


    const index = await elastic.index({
        index:indexName,
        id:document.id,
        document:{...document,createdAt:new Date().toISOString()}
    })

    if(index.result == "created") return true;

    return false;
}

export async function UpdateEmbedIndex(document: ElasticDocumentType ): Promise<boolean> {
    const indexName = process.env.INDEX_NAME ?? "documents"

    const update = await elastic.update({
        index:indexName,
        id:document.id,
        doc:{...document,updatedAt:new Date().toISOString()}
    });

    if(update.result == "updated") return true;
    return false;
        
 }

 export async function DeleteEmbedIndex(id: string): Promise<boolean> {
    const indexName = process.env.INDEX_NAME ?? "documents"

    const del = await elastic.delete({
        index:indexName,
        id:id,
    });

    if(del.result == "deleted") return true;
    return false;
        
 }

  export async function GetEmbedIndex(id: string): Promise<ElasticDocumentType | null> {
    const indexName = process.env.INDEX_NAME ?? "documents"

    const index = await elastic.get({
        index:indexName,
        id:id,
    });

    if(index._source!=null){
        const data = index._source as any

        const result : ElasticDocumentType  = {kind:data.kind,id:data.id,embedding:data.embedding}

        return result;
    }

    return null;

 }

  export async function SearchEmbedIndex(document: ElasticDocumentType,ids:string[]): Promise<ElasticDocumentResult[] | null> {
    const indexName = process.env.INDEX_NAME ?? "documents"

    const result = await elastic.search({

    index:indexName,

    knn:{
        field:"embedding",

        query_vector:document.embedding,

        k:3,

        num_candidates:3,

        filter:{
            ids:{
                values:ids
            }

        }
    }

    });
    if(result.hits.hits.length > 0) {
        const results : ElasticDocumentResult[] = []
        result.hits.hits.map((hit)=>{
            if(hit!=null && hit._source != null){
            const source:any = hit._source
            const result : ElasticDocumentResult = {id:source.id,kind:source.kind,score:hit._score}
            results.push(result)
            }
        })
        return results
    }
    
    return null;

 }