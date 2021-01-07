import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const SecondPage = ({ data }) => (
  <Layout>
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div>
        <h1>Hi from the second page</h1>
        <p>Welcome to page 2</p>
      </div>
      <div>
        <GatsbyImage image={getImage(data.file)} />
      </div>
    </div>
    <SEO title="Page two" />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage

export const query = graphql`
  query {
    file(name: { eq: "leif-christoph-gottwald-EjvCKZ6OHyk-unsplash" }) {
      childImageSharp {
        gatsbyImageData(
          maxWidth: 800
          quality: 80
          tracedSVGOptions: { color: "#0b0112" }
          placeholder: TRACED_SVG
        )
      }
    }
  }
`
