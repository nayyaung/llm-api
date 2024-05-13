const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { pull } = require("langchain/hub");
const fs = require("fs");
const { GoogleVertexAIEmbeddings } = require("@langchain/community/embeddings/googlevertexai");
const { VertexAI, ChatVertexAI } = require("@langchain/google-vertexai");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const formatDocumentsAsString = require("langchain/util/document").formatDocumentsAsString;
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
    RunnableSequence,
    RunnablePassthrough,
} = require("@langchain/core/runnables");
const { BufferMemory } = require("langchain/memory");

const getAnswer = async function (input) {
    const loader = new DocxLoader(
        process.env.CV_FILE_PATH
    );

    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const vectorStoreSource = 'data/vectorstore.hnsw';
    let vectorStore;
    if (fs.existsSync(vectorStoreSource)) {
        vectorStore = await HNSWLib.load(vectorStoreSource, new GoogleVertexAIEmbeddings());
    } else {
        vectorStore = await HNSWLib.fromDocuments(docs, new GoogleVertexAIEmbeddings());
        await vectorStore.save(vectorStoreSource);
    }

    const retriever = vectorStore.asRetriever();
    const prompt = await pull("rlm/rag-prompt");
    const model = new VertexAI({
        temperature: 0.7,
        model: "gemini-1.0-pro-002",
    });

    const memory = new BufferMemory();
    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
            chatHistory: async () => {
                const savedMemory = await memory.loadMemoryVariables({});
                const hasHistory = savedMemory.chatHistory?.length > 0;
                return hasHistory ? savedMemory.chatHistory : null;
            },
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    try {
        result = await chain.invoke(input);
        console.log(`Executing: ${input}`);
        console.log(`result: ${result}`);
        await memory.saveContext(
            {
                question: input,
            },
            {
                text: result,
            }
        );
        return result;
    } catch (error) {
        console.error(`Error: ${error.code}, Error Status: ${error.response?.status}, Error Status Text: ${error.response?.statusText}`);
        console.error(error);
        throw error;
    }
}

module.exports = getAnswer;