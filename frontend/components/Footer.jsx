import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaWhatsapp,
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Sneakers', path: '/shop?category=sneakers' },
    { name: 'Men\'s Clothing', path: '/shop?category=men' },
    { name: 'Women\'s Clothing', path: '/shop?category=women' },
    { name: 'Traditional Wear', path: '/shop?category=traditional' },
    { name: 'Accessories', path: '/shop?category=accessories' },
  ];

  const customerService = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Shipping & Delivery', path: '/shipping' },
    { name: 'Returns & Exchanges', path: '/returns' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'FAQ', path: '/faq' },
  ];

  const features = [
    { icon: <FaTruck />, title: 'Free Delivery', desc: 'On orders over KSh 3,000' },
    { icon: <FaShieldAlt />, title: 'Secure Payment', desc: '100% secure with M-Pesa' },
    { icon: <FaCreditCard />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <FaHeadset />, title: '24/7 Support', desc: 'We\'re here to help' },
  ];

  return (
    <FooterContainer>
      <FeaturesSection>
        <div className="container">
          <FeaturesGrid>
            {features.map((feature, index) => (
              <Feature key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </Feature>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <MainFooter>
        <div className="container">
          <FooterGrid>
            <FooterColumn>
              <h3>Kibanda Sneakers & Clothing</h3>
              <p>Your premier destination for authentic Kenyan fashion, sneakers, and accessories. We bring you quality products at affordable prices.</p>
              <SocialLinks>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                </a>
              </SocialLinks>
            </FooterColumn>

            <FooterColumn>
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Customer Service</h4>
              <ul>
                {customerService.map((service) => (
                  <li key={service.path}>
                    <Link to={service.path}>{service.name}</Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ContactInfo>
                <li>
                  <FaMapMarkerAlt />
                  <span>Nairobi, Kenya</span>
                </li>
                <li>
                  <FaPhone />
                  <span>+254 712 345 678</span>
                </li>
                <li>
                  <FaEnvelope />
                  <span>info@kibanda.co.ke</span>
                </li>
              </ContactInfo>
              
              <PaymentMethods>
                <p>We Accept:</p>
                <PaymentIcons>
                  <span>M-Pesa</span>
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>PayPal</span>
                </PaymentIcons>
              </PaymentMethods>
            </FooterColumn>
          </FooterGrid>
        </div>
      </MainFooter>

      <BottomFooter>
        <div className="container">
          <p>&copy; {currentYear} Kibanda Sneakers & Clothing. All rights reserved.</p>
          <p>Prices are in Kenyan Shillings (KSh)</p>
        </div>
      </BottomFooter>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  margin-top: auto;
`;

const FeaturesSection = styled.div`
  background: white;
  padding: 40px 0;
  border-bottom: 1px solid #e0e0e0;
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
    font-size: 32px;
    color: #667eea;
  }

  h4 {
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

const MainFooter = styled.div`
  padding: 60px 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterColumn = styled.div`
  h3, h4 {
    margin-bottom: 20px;
    color: white;
  }

  h3 {
    font-size: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h4 {
    font-size: 18px;
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }

  p {
    color: #bdc3c7;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 12px;
  }

  a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 14px;

    &:hover {
      color: #667eea;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #34495e;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: translateY(-3px);
    }
  }
`;

const ContactInfo = styled.ul`
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    color: #bdc3c7;

    svg {
      color: #667eea;
      font-size: 18px;
    }

    span {
      font-size: 14px;
    }
  }
`;

const PaymentMethods = styled.div`
  margin-top: 30px;

  p {
    font-size: 14px;
    margin-bottom: 10px;
    color: #bdc3c7;
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  span {
    background: #34495e;
    padding: 5px 12px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
  }
`;

const BottomFooter = styled.div`
  background: #1a252f;
  padding: 20px 0;
  text-align: center;

  p {
    color: #bdc3c7;
    margin: 5px 0;
    font-size: 14px;
  }
`;

export default Footer;