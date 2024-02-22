import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const Deck = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let deck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      setDeckId(deck.data.deck_id);
    }
    fetchData();
  }, []);

  async function drawCard() {
    try {
      let drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      if (drawResponse.data.remaining === 0) {
        alert('Error: no cards remaining!');
        return;
      }
      setCards(cards => [...cards, drawResponse.data.cards[0]]);
    } catch (error) {
      alert(error);
    }
  }

  async function shuffleDeck() {
    setIsShuffling(true);
    await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    setCards([]);
    setIsShuffling(false);
  }

  return (
    <div>
      <button onClick={drawCard} disabled={isShuffling}>Draw a card!</button>
      <button onClick={shuffleDeck} disabled={isShuffling || !deckId}>Shuffle</button>
      {cards.map(card => (
        <Card key={card.code} image={card.image} />
      ))}
    </div>
  );
};
