'use client'

import { Button, Container, Text, Title } from '@mantine/core'

const Landing = () => {
  return (
    <div className="h-[50vh] bg-hero bg-no-repeat bg-cover bg-center">
      <Container className="flex flex-col h-full justify-center" size="lg">
        <Title className="text-4xl text-white mb-5">An AI Conversationalist</Title>
        <Text className="text-white text-2xl mb-10">
          A helpful assistant that can listen to your voice and speak to you
        </Text>
        <div>
          <Button className="text-xl" variant="gradient" gradient={{ from: 'pink', to: 'yellow' }} size="xl" mb="lg">
            Get started
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default Landing
