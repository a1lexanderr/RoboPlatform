interface SectionProps {
    title: string;
    children: React.ReactNode;
    backgroundColor?: 'white' | 'gray';
  }
  
  const Section: React.FC<SectionProps> = ({ 
    title, 
    children, 
    backgroundColor = 'white' 
  }) => (
    <section className={`bg-${backgroundColor === 'white' ? 'white' : 'gray-100'} py-12 md:py-20 lg:py-24`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
          {title}
        </h1>
        {children}
      </div>
    </section>
  );

  export default Section;