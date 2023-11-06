from character import *
import spacy

if __name__ == '__main__':
    # ch = Character.create('Alex',)
    nlp = spacy.load("en_core_web_lg")  # make sure to use larger package!
    main = nlp("Agreed to start chopping logs")
    main_no_stop_words = nlp(' '.join([str(t) for t in main if not t.is_stop]))

    doc2 = nlp("chop down tree")
    doc2_1 = nlp("chop logs")
    doc3 = nlp("cook potatoes")
    doc4 = nlp("plant seed")
    doc5 = nlp("plant tree")

    # Similarity of two documents
    print(main_no_stop_words, "<->", doc2, main.similarity(doc2))
    print(main_no_stop_words, "<->", doc2, main.similarity(doc2_1))
    print(main_no_stop_words, "<->", doc3, main.similarity(doc3))
    print(main_no_stop_words, "<->", doc4, main.similarity(doc4))
    print(main_no_stop_words, "<->", doc5, main.similarity(doc5))
