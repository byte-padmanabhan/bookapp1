export default function BookCard() {
    const books = [
      { title: "Atomic Habits", isbn: "0735211299" },
      { title: "Ikigai", isbn: "0143130722" },
      { title: "Rich Dad Poor Dad", isbn: "1612680194" },
      { title: "The Subtle Art of Not Giving a F*ck", isbn: "0062457713" },
      { title: "The Power of Habit", isbn: "081298160X" },
      { title: "Think and Grow Rich", isbn: "1937879495" },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {books.map((book) => (
          <div
            key={book.isbn}
            className="bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
              alt={book.title}
              className="rounded-lg w-full h-64 object-cover"
            />
            <h3 className="text-lg font-semibold mt-3 text-gray-800 text-center">
              {book.title}
            </h3>
          </div>
        ))}
      </div>
    );
  }
  