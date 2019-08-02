import React from "react";
import { graphql} from 'gatsby';
import homePageStyles from '../styles/homepage.module.css';
import Layout from '../components/layout';
import Social from '../components/social';
import profile from '../images/profile.jpg';

export default ({ data }) => (
    <Layout page="home">
        <h1 className="hide">{data.site.siteMetadata.title}</h1>
        <div className={homePageStyles.profilePic}><img src={profile} alt={data.site.siteMetadata.author} /></div>
        <h1 className={homePageStyles.heading}><span className="firstname">{data.site.siteMetadata.author.split(' ')[0]}</span><span className={homePageStyles.lastname}>{data.site.siteMetadata.author.split(' ')[1]}</span></h1>
        <p className={homePageStyles.homepagePara}>
            {data.site.siteMetadata.introTagLines.map((tagLine, index) => (
                <span key={index}>{tagLine}</span>
            ))}
        </p>
        <aside className={homePageStyles.intro}>
            <Social data={data.allSocialSvgIconData} />
        </aside>
    </Layout>
);

export const query = graphql`
    query {
        site {
            siteMetadata {
                title
                author
                introTagLines
            }
        }
        allSocialSvgIconData {
            edges {
                node {
                    id
                    key
                    url
                    alt
                    svg
                }
            }
        }
    }
`;
