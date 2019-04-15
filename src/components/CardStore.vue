<template>
	<span></span>
</template>

<script>
/** 
 Global data store vor cards 
 This is not a UI component. This is an adapter to PouchDB.
 */
 
 
//====================================
// Test Fixtures
//TODO: read all this from a DB

// one column for each status
const columns = [
  { 
    _id: 0,
    title: "Todo",
  },
  { 
    _id: 1,
    title: "In Progress",
  },
  { 
    _id: 2,
    title: "Done",
  },
]

const releases = [
  {
    _id: 0,
    title: "Bluefish Release"
  },
  {
    _id: 1,
    title: "Carnivore Release"
  },
]

//===========================================================================
// Utility methods for mapping PuchDB results into data for KanbanBoard
// TODO: make this configurable   and also not just for release swimlanes, but any type of swimlane
var getCardsForRelAndColFunc = function(allCards, rel, col) {
  return allCards.filter(card =>  {
    return card.release._id === rel._id && card.status === col.title    
  })
}
 
 
var getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
 
//====================================
// PouchDB
// eslint-disable-next-line no-undef
PouchDB.plugin(require('pouchdb-upsert'));
// eslint-disable-next-line no-undef
var db = new PouchDB('kanban_board_db');

 
export default {
	data:	function() { return	{
		cards: [],
		releases: releases,
		columns: columns,
	}},
	methods: {
    
    getAllCardsFromDb()  {
      return db.allDocs({
        include_docs: true
      }).then(res => {
        console.log("getAllCardsFromDB", res)
        this.cards = res.rows.map(row => row.doc)
        return this.cards
      })
    },

    deleteAllDocsInDb() {
      console.log("Removing all data from the DB! ")
      return db.allDocs({
        //include_docs: true,
      }).then(function (result) {
        //console.log("result", result)
        result.rows.forEach(doc => db.remove(doc.id, doc.value.rev))
      }).catch(function (err) {
        console.log("Cannot get allDocs", err);
      });
      
    },    
    
    createTestData() {
      console.log("===== Creating new testdata")
      var cards = []
      // at least one card in every release and col
      for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < releases.length; j++) {
          cards.push({
            _id: "CardInCol"+i+"Rel"+j, 
            title: "Card Col"+i+" Rel"+j,
            status: columns[i].title,
            release: releases[j],
            description: "One first card in col "+i+" and release "+releases[j].title,
            labels: ["eins", "zwei", "drei"]
          })
        }
      }
      for (let i = 0; i < 10; i++) {
        cards.push({
          _id: "Card"+i, 
          title: "Card  "+i,
          status: columns[getRandomInt(columns.length)].title,
          release: releases[getRandomInt(releases.length)],
          description: "Some dummy content for card "+i+" with <b>HTML</b>. asdflkjawe kltnlasdg klaj glkj ag lk adlkgjaergelkgj. laskjfasd lkjasd lkweklwejnwefkasdhf vsdf wenwef asdlkfjw eflknf aslkenff enfweo pivuicvioen.",
        })
      }
      return db.bulkDocs(cards)
        .then(res => {
          console.log("DONE. Created "+cards.length+" cards.")
          return res
        })
        .catch(err => console.error("ERROR. Could not createTestData", err))
    },
    
    
    /** 
     map dbResult to releases with columns  and cards 
     releases -> columns -> cards
     Columns are **inside** releases mostly because of HTML layout reasons.
     @return array of releases with columns and cards inside 
    */
    getKanbanData() {
      return this.releases.map(rel => ({
        '_id': rel._id,
        'title': rel.title,
        'columns': this.columns.map(col => ({
          '_id':   col._id,
          'cards': getCardsForRelAndColFunc(this.cards, rel, col)
        }))
      }))
    },

    /** 
      Fetch most current version of card from DB.
      Emit 'editCard' event that will show the EditCard.vue modal.
     */
    editCard(card) {
      db.get(card._id).then(currentCardDoc => {
        this.$emit('editCard', currentCardDoc); 
      })
    },

    /** store card to DB and return the saved result (with new rev) */
    saveCard(newCard) {
      return db.put(newCard)
        .then(res => {
          return db.get(res.id).then(savedCard => {
            var cardIdx = this.getCardIdx(savedCard._id)
            if (cardIdx) this.cards[cardIdx] = savedCard            
            this.$emit('cardSaved', savedCard)
            return savedCard
          })
        })
        .catch(err => {
          console.error("Card could not be updated. Conflict?", err)
          if (err.status === 409) {
            console.log("Conflict 409")
          }
        })
    },
    
    getCardIdx(cardId) {
      return this.cards.findIndex(card => card._id === cardId)
    },

	}
		
}
</script>

<style>
</style>

