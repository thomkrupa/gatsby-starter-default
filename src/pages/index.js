import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    {data.allFile.edges.map(({ node }) => (
      <div key={node.id}>
        <GatsbyImage image={getImage(node)} alt="my gatsby image" />
      </div>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allFile {
      edges {
        node {
          id
          name
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
    }
  }
`
