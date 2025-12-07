import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  FaTruck, 
  FaShieldAlt, 
  FaCreditCard, 
  FaHeadset,
  FaArrowRight 
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { fetchFeaturedProducts, fetchCategories } from '../store/slices/productSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, categories, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const categoriesSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Latest Sneaker Collection',
      subtitle: 'Up to 40% off on premium brands',
      buttonText: 'Shop Now',
      link: '/shop?category=sneakers'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Traditional Kenyan Wear',
      subtitle: 'Authentic African designs',
      buttonText: 'Explore Collection',
      link: '/shop?category=traditional'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1558769132-cb1c458e4222?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on selected items',
      buttonText: 'View Deals',
      link: '/shop?discount=true'
    }
  ];

  const shopCategories = [
    { id: 'sneakers', name: 'Sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 85 },
    { id: 'men', name: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 120 },
    { id: 'women', name: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 95 },
    { id: 'traditional', name: 'Traditional', image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 65 },
    { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1590649887896-6c8e6668407f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', count: 45 },
  ];

  const features = [
    { icon: <FaTruck />, title: 'Free Delivery', desc: 'On orders over KSh 3,000' },
    { icon: <FaShieldAlt />, title: 'Secure Payment', desc: '100% secure with M-Pesa' },
    { icon: <FaCreditCard />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <FaHeadset />, title: '24/7 Support', desc: 'We\'re here to help' },
  ];

  return (
    <>
      <Helmet>
        <title>Kibanda Sneakers & Clothing - Authentic Kenyan Fashion</title>
        <meta name="description" content="Shop premium sneakers, clothing, and traditional Kenyan wear at Kibanda Fashion. Free delivery on orders over KSh 3,000." />
      </Helmet>

      <HomeContainer>
        {/* Hero Slider */}
        <HeroSection>
          <Slider {...heroSliderSettings}>
            {heroSlides.map((slide) => (
              <HeroSlide key={slide.id}>
                <HeroImage src={slide.image} alt={slide.title} />
                <HeroContent>
                  <h2>{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                  <Link to={slide.link} className="btn-primary">
                    {slide.buttonText} <FaArrowRight />
                  </Link>
                </HeroContent>
              </HeroSlide>
            ))}
          </Slider>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <div className="container">
            <FeaturesGrid>
              {features.map((feature, index) => (
                <Feature key={index}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </Feature>
              ))}
            </FeaturesGrid>
          </div>
        </FeaturesSection>

        {/* Shop by Category */}
        <Section>
          <div className="container">
            <SectionHeader>
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/shop" className="view-all">
                View All Categories <FaArrowRight />
              </Link>
            </SectionHeader>

            <CategoriesGrid>
              {shopCategories.map((category) => (
                <CategoryCard key={category.id} to={`/shop?category=${category.id}`}>
                  <CategoryImage src={category.image} alt={category.name} />
                  <CategoryOverlay>
                    <h3>{category.name}</h3>
                    <p>{category.count} Products</p>
                  </CategoryOverlay>
                </CategoryCard>
              ))}
            </CategoriesGrid>
          </div>
        </Section>

        {/* Featured Products */}
        <Section bgLight>
          <div className="container">
            <SectionHeader>
              <h2 className="section-title">Featured Products</h2>
              <Link to="/shop" className="view-all">
                View All Products <FaArrowRight />
              </Link>
            </SectionHeader>

            {loading ? (
              <Loading>Loading featured products...</Loading>
            ) : featuredProducts.length > 0 ? (
              <ProductsGrid>
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </ProductsGrid>
            ) : (
              <NoProducts>No featured products available</NoProducts>
            )}
          </div>
        </Section>

        {/* Promo Banner */}
        <PromoSection>
          <div className="container">
            <PromoContent>
              <h2>Summer Sale is Here!</h2>
              <p>Get up to 50% off on selected sneakers and clothing. Limited time offer!</p>
              <Link to="/shop?discount=true" className="btn-primary">
                Shop Sale <FaArrowRight />
              </Link>
            </PromoContent>
          </div>
        </PromoSection>

        {/* Why Choose Us */}
        <Section>
          <div className="container">
            <h2 className="section-title">Why Choose Kibanda?</h2>
            <WhyChooseGrid>
              <WhyChooseCard>
                <h3>🇰🇪 Authentic Kenyan</h3>
                <p>We source and support local Kenyan artisans and manufacturers.</p>
              </WhyChooseCard>
              <WhyChooseCard>
                <h3>💯 Quality Guaranteed</h3>
                <p>All our products go through strict quality checks before shipping.</p>
              </WhyChooseCard>
              <WhyChooseCard>
                <h3>🚚 Fast Delivery</h3>
                <p>Same-day delivery in Nairobi, 2-3 days nationwide.</p>
              </WhyChooseCard>
              <WhyChooseCard>
                <h3>🔄 Easy Returns</h3>
                <p>Not satisfied? Return within 30 days for a full refund.</p>
              </WhyChooseCard>
            </WhyChooseGrid>
          </div>
        </Section>
      </HomeContainer>
    </>
  );
};

const HomeContainer = styled.div``;

const HeroSection = styled.section`
  margin-top: -80px;
  position: relative;

  .slick-dots {
    bottom: 20px;
    
    li button:before {
      color: white;
      font-size: 10px;
    }
    
    li.slick-active button:before {
      color: #667eea;
    }
  }
`;

const HeroSlide = styled.div`
  position: relative;
  height: 600px;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: white;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.6);
  padding: 40px;
  border-radius: 10px;

  h2 {
    font-size: 48px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  p {
    font-size: 20px;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 768px) {
    left: 5%;
    right: 5%;
    padding: 20px;
    
    h2 {
      font-size: 32px;
    }
    
    p {
      font-size: 16px;
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 60px 0;
  background: white;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  svg {
    font-size: 36px;
    color: #667eea;
  }

  h3 {
    color: #333;
    margin-bottom: 5px;
    font-size: 18px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
`;

const FeatureIcon = styled.div`
  flex-shrink: 0;
`;

const Section = styled.section`
  padding: 80px 0;
  background: ${props => props.bgLight ? '#f9f9f9' : 'white'};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .view-all {
    color: #667eea;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: gap 0.3s ease;

    &:hover {
      gap: 10px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  display: block;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${CategoryCard}:hover & {
    transform: scale(1.1);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px;
  
  h3 {
    font-size: 20px;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 14px;
    opacity: 0.9;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 18px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 18px;
  background: white;
  border-radius: 10px;
`;

const PromoSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const PromoContent = styled.div`
  max-width: 600px;
  margin: 0 auto;

  h2 {
    font-size: 42px;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .btn-primary {
    background: white;
    color: #667eea;
    
    &:hover {
      background: #f8f9fa;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 32px;
    }
    
    p {
      font-size: 16px;
    }
  }
`;

const WhyChooseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const WhyChooseCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 20px;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

export default HomePage;