import { Client } from "@elastic/elasticsearch";

export const elastic = new Client({
    node: process.env.ELASTIC_URL
});



export type ElasticDocumentParameters  = {id:string,sendedId:string,kind:string,embedding:any};

export type ElasticDocumentType  = {sendedId:string,kind:string,embedding:any,createdAt:string | null | undefined,updatedAt:string | null | undefined};

export type ElasticDocumentResult  = {id:string | undefined,sendedId:string,kind:string,score:number | null | undefined,createdAt:string | null | undefined,updatedAt:string | null | undefined};

export async function CreateIndex() : Promise<boolean>{
    const indexName = process.env.INDEX_NAME ?? "documents"
    
    if(await elastic.indices.exists({index:indexName})){
        return true;
    }

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





export async function CreateEmbedIndex(document: ElasticDocumentParameters ): Promise<boolean> {
    
    const indexName = process.env.INDEX_NAME ?? "documents"

    const documentSended : ElasticDocumentType = {sendedId:document.sendedId,kind:document.kind,embedding:document.embedding,
        createdAt:new Date().toISOString(),updatedAt:null
    } 

    const index = await elastic.index({
        index:indexName,
        id:document.id,
        document:documentSended
    })

    if(index.result == "created") return true;

    return false;
}

export async function UpdateEmbedIndex(document: ElasticDocumentParameters): Promise<boolean> {
    const indexName = process.env.INDEX_NAME ?? "documents"

     const documentSended : ElasticDocumentType = {sendedId:document.sendedId,kind:document.kind,embedding:document.embedding,
        updatedAt:new Date().toISOString(),createdAt:null
    } 

    const update = await elastic.update({
        index:indexName,
        id:document.id,
        doc:documentSended
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

        const result : ElasticDocumentType  = {kind:data.kind,sendedId:data.id,embedding:data.embedding,createdAt:data.createdAt,updatedAt:data.updatedAt
        }

        return result;
    }

    return null;

 }

  export async function SearchEmbedIndex(appEmbedding: any,ids:string[]): Promise<ElasticDocumentResult[] | null> {
    const indexName = process.env.INDEX_NAME ?? "documents"

    const result = await elastic.search({

    index:indexName,

    knn:{
        field:"embedding",
        query_vector:appEmbedding,
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
            const result : ElasticDocumentResult = {id:hit._id,sendedId:source.id,kind:source.kind,score:hit._score,createdAt:source.createdAt,updatedAt:source.updatedAt}
            results.push(result)
            }
        })
        return results
    }
    
    return null;

 }