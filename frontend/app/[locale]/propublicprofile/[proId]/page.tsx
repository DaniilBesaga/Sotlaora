'use client';

import React, { useEffect, useState } from 'react';
import { 
  MapPin, Star, Phone, Mail, CheckCircle2, 
  MessageCircle, Briefcase, ThumbsUp, Calendar, 
  ShieldCheck, Award, Clock,
  Hammer,
  ExternalLink,
  Youtube
} from 'lucide-react';
import styles from './ProPublicProfile.module.css'; // We'll define new styles for this
import { ProPublicProfile } from '@/types/ProDTO';
import { useParams } from 'next/navigation';

// Types (Mocked based on your existing structure)
interface Review {
  id: string;
  clientName: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  projectTitle: string;
}

interface ProPortfolioPublicDTO {
  description: string;
  youtubeLink: string;
  subcategoryTitle: string; // Backend sends ID here based on your query
  imageRef: string;
}

export default function ProPublicProfilePage() {
  const { proId } = useParams<{ proId: string }>();
  const [profileData, setProfileData] = useState<ProPublicProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        const res = await fetch(`http://localhost:5221/api/pro/propublicprofile/${proId}`); // Example pro ID
        const data = await res.json();
        setProfileData(data);
        console.log(data);
      }
      catch(err){
        console.error('Error fetching profile:', err);
      }
    }
    fetchProfile();
  }, []);

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');

  useEffect(() => {

    const fetchPortfolio = async () => {
      try {
        setLoadingPortfolio(true);
        // Assuming you create an endpoint that runs the query you provided
        const res = await fetch(`http://localhost:5221/api/pro/propublicportfolio/${proId}`);
        if (res.ok) {
          const data: ProPortfolioPublicDTO[] = await res.json();
          setPortfolios(data);
        }
      } catch (err) {
        console.error("Failed to load portfolio", err);
      } finally {
        setLoadingPortfolio(false);
      }
    };

    if (activeTab === 'portfolio') {
      fetchPortfolio();
    }
  }, [activeTab, proId]);

  const [portfolios, setPortfolios] = useState<ProPortfolioPublicDTO[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);


  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5221/api/pro/propublicreviews/${proId}`);
        if (res.ok) {
          const data: Review[] = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, proId]);

  return ( profileData &&
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* --- Header Profile Card --- */}
        <header className={styles.headerCard}>
          <div className={styles.headerMain}>
            <div className={styles.avatarWrapper}>
              <img src={profileData?.imageRef} alt={profileData?.userName} className={styles.avatar} />
              <div className={styles.verifiedBadge} title="Verified Pro">
                <ShieldCheck size={16} />
              </div>
            </div>
            
            <div className={styles.headerInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.hName}>{profileData?.userName}</h1>
                <span className={styles.statusDot} title="Online now" />
              </div>
              
              <div className={styles.metaRow}>
                <div className={styles.ratingBadge}>
                  <Star size={14} fill="#FFD700" stroke="#FFD700" />
                  <span className={styles.ratingVal}>{profileData?.rating}</span>
                  <span className={styles.reviewCount}>({profileData?.reviewsCount} отзывов)</span>
                </div>
                <div className={styles.locationBadge}>
                  <MapPin size={14} />
                  {profileData?.location || 'Timisioara'}
                </div>
              </div>

              <div className={styles.tagsRow}>
                {profileData?.proSubcategories.slice(0, 3).map((s, i) => (
                  <span key={i} className={styles.skillTag}>{s.title}</span>
                ))}
                {profileData?.proSubcategories.length! > 3 && (
                  <span className={styles.skillTagMore}>+{profileData?.proSubcategories.length! - 3} еще</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <Award size={20} className={styles.statIcon} />
                <div className={styles.statText}>
                  <strong>{profileData?.completedOrdersCount}</strong>
                  <span>Заказов</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <Calendar size={20} className={styles.statIcon} />
                <div className={styles.statText}>
                  <strong>{profileData?.createdAt &&
    new Date(profileData.createdAt).toLocaleDateString()}</strong>
                  <span>На сайте</span>
                </div>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <button className={styles.btnPrimary}>Предложить заказ</button>
              <button className={styles.btnSecondary}><MessageCircle size={18} /></button>
            </div>
          </div>
        </header>

        <div className={styles.mainGrid}>
          
          {/* --- Left Column: Info & Contacts --- */}
          <aside className={styles.sidebar}>
            
            {/* Contacts Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Контакты</h3>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Phone size={18} className={styles.contactIcon} />
                  <span>{profileData?.phoneNumber}</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={18} className={styles.contactIcon} />
                  <span>{profileData?.email}</span>
                </div>
              </div>
              <div className={styles.safetyNote}>
                <ShieldCheck size={14} />
                Контакты проверены
              </div>
            </div>

            {/* Verification Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Верификация</h3>
              <ul className={styles.checkList}>
                <li className={styles.checkItem}><CheckCircle2 size={16} color="#10b981" /> Паспорт проверен</li>
                <li className={styles.checkItem}><CheckCircle2 size={16} color="#10b981" /> Телефон подтвержден</li>
                <li className={styles.checkItem}><CheckCircle2 size={16} color="#10b981" /> Email подтвержден</li>
              </ul>
            </div>

          </aside>

          {/* --- Right Column: Content --- */}
          <main className={styles.contentArea}>
            
            {/* Tabs */}
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('about')}
              >
                О специалисте
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'portfolio' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Портфолио
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Отзывы ({profileData?.reviewsCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              
              {activeTab === 'about' && (
                <div className={styles.fadeIn}>
                  <div className={styles.sectionBlock}>
                    <h3 className={styles.blockTitle}>Обо мне</h3>
                    <p className={styles.bioText}>{profileData?.bio}</p>
                  </div>

                  <div className={styles.sectionBlock}>
                    <h3 className={styles.blockTitle}>Услуги</h3>
                    <div className={styles.servicesGrid}>
                      {profileData?.proSubcategories.map((service, idx) => (
                        <div key={idx} className={styles.serviceItem}>
                          <Briefcase size={16} className={styles.serviceIcon} />
                          {service.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
              <div className={styles.grid}>
                {loadingPortfolio ? (
                   <p style={{padding:20, color:'#94a3b8'}}>Загрузка портфолио...</p>
                ) : portfolios.length === 0 ? (
                   <p style={{padding:20, color:'#94a3b8'}}>Портфолио пусто</p>
                ) : (
                  portfolios.map((item, index) => (
                    <div key={index} className={styles.card} style={{padding:0, overflow:'hidden', gap:0, display:'flex', flexDirection:'column'}}>
                      
                      {/* 1. Image */}
                      <div className={styles.mainThumb} style={{height:200, borderRadius:0, position:'relative'}}>
                        <img 
                          src={item.imageRef || '/images/placeholder.jpg'} 
                          alt="Project" 
                          style={{width:'100%', height:'100%', objectFit:'cover'}}
                        />
                        {/* YouTube Badge overlay if link exists */}
                        {item.youtubeLink && (
                          <a 
                            href={item.youtubeLink} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{
                              position:'absolute', bottom:10, right:10, 
                              background:'rgba(255,0,0,0.9)', color:'white', 
                              borderRadius:'50%', width:36, height:36, 
                              display:'flex', alignItems:'center', justifyContent:'center'
                            }}
                          >
                            <Youtube size={18} fill="white" />
                          </a>
                        )}
                      </div>

                      {/* 2. Description & Meta */}
                      <div style={{padding:16, display:'flex', flexDirection:'column', gap:8, flex:1}}>
                        
                        {item.subcategoryTitle && (
                           <span className={styles.chip} style={{fontSize:11, width:'fit-content'}}>
                             Категория #{item.subcategoryTitle}
                           </span>
                        )}

                        <p className={styles.cardDesc} style={{fontSize:14, WebkitLineClamp: 3, margin:0}}>
                          {item.description || "Без описания"}
                        </p>

                        {/* Link Text */}
                        {item.youtubeLink && (
                          <a href={item.youtubeLink} target="_blank" rel="noreferrer" style={{marginTop:'auto', fontSize:13, color:'#2563eb', display:'flex', alignItems:'center', gap:4, fontWeight:600, textDecoration:'none'}}>
                            <ExternalLink size={14} /> Смотреть видео
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

              {activeTab === 'reviews' && (
                <div className={styles.reviewsList}>
                  {reviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <img src={review.avatar} alt={review.clientName} className={styles.reviewerAvatar} />
                        <div className={styles.reviewerInfo}>
                          <div className={styles.reviewerName}>{review.clientName}</div>
                          <div className={styles.reviewMeta}>
                            <div className={styles.stars}>
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  fill={i < review.rating ? "#FFD700" : "none"} 
                                  stroke={i < review.rating ? "#FFD700" : "#cbd5e1"}
                                />
                              ))}
                            </div>
                            <span className={styles.reviewDate}>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.projectTag}>
                        <Hammer size={12} />
                        Заказ: {review.projectTitle}
                      </div>
                      <p className={styles.reviewText}>{review.text}</p>
                    </div>
                  ))}
                  
                  <button className={styles.loadMoreBtn}>Показать еще отзывы</button>
                </div>
              )}

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}