function Theme() {
  const colors = [
    { name: 'Light Coral', class: 'bg-light-coral' },
    { name: 'Coral Pink', class: 'bg-coral-pink' },
    { name: 'Melon', class: 'bg-melon' },
    { name: 'Apricot', class: 'bg-apricot' },
    { name: 'Light Orange', class: 'bg-light-orange' },
  ]

  return (
    <div className="p-8 font-oxygen">
      <h1 className="text-3xl font-bold mb-8">Theme Preview</h1>
      
      <div className="space-y-8">
        {/* Color Squares */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div className={`${color.class} w-full h-32 rounded-lg shadow-md`} />
              <p className="text-center">{color.name}</p>
            </div>
          ))}
        </div>

        {/* Gradient Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Gradients</h2>
          <div className="bg-gradient-coral h-32 rounded-lg shadow-md" />
        </div>

        {/* Text Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Text Examples</h2>
          <div className="space-y-2">
            <p className="text-light-coral">Text in Light Coral</p>
            <p className="text-coral-pink">Text in Coral Pink</p>
            <p className="text-melon">Text in Melon</p>
            <p className="text-apricot">Text in Apricot</p>
            <p className="text-light-orange">Text in Light Orange</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Theme 