import time
import numpy as np
import pandas as pd
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
# from selenium import webdriver
# from selenium.webdriver.common.by import By
import warnings


class resume_analyzer:

    def pdf_to_chunks(pdf):
        # read pdf and it returns memory address
        pdf_reader = PdfReader(pdf)

        # extrat text from each page separately
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        # Split the long text into small chunks.
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=700,
            chunk_overlap=200,
            length_function=len)

        chunks = text_splitter.split_text(text=text)
        return chunks


    def openai(openai_api_key, chunks, analyze):
        try:
            # Assuming OpenAIEmbeddings is correctly implemented and imported
            embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

            # Correct use of FAISS for embedding text chunks
            vectorstores = FAISS.from_texts(chunks, embedding=embeddings)
            print(vectorstores)
        except Exception as e:
            print(f"Error during embedding or FAISS processing: {e}")
            return None

        try:
            # Similarity search with proper error handling
            docs = vectorstores.similarity_search(query=analyze, k=3)
            print(docs)
        except Exception as e:
            print(f"Error during similarity search: {e}")
            return None

        try:
            # Assuming ChatOpenAI and load_qa_chain are correctly implemented and imported
            llm = ChatOpenAI(model='gpt-3.5-turbo', api_key=openai_api_key)
            print(llm)
            chain = load_qa_chain(llm=llm, chain_type='stuff')

            response = chain.run(input_documents=docs, question=analyze)
            return response
        except Exception as e:
            print(f"Error during QA processing: {e}")
            return None


    def summary_prompt(query_with_chunks):

        query = f''' need to detailed summarization of below resume. give me the output in the following JSON format:
        "education": [
            "name": "Wharton School of the University of Pennsylvania",
        ],
        "email": "elonmusk@teslamotors.com",
        "experience": [
            "dates": [
            "2006-06"
            ],
            "name": "Solar City"
        ],
        "name": "Elon Musk",
        "phone": "650 68100",
        "skills": [
          "Entrepreneurship",
          "Innovation",
          "Mars",
          "Space",
          "Electric Cars",
          "Physics",
          "Maths",
          "Calculus",
          "Distrupting Technologies"
        ]
                    """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                    {query_with_chunks}
                    """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                    '''
        return query
