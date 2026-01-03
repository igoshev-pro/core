export function generateReadableRandomDomain(): string {
  const adjectives = [
    'quick','bright','clever','fast','smart','happy','sunny','brave','calm','cool',
    'kind','sharp','strong','swift','silent','loud','gentle','bold','proud','fresh',
    'wise','wild','free','playful','fierce','friendly','curious','eager','alert','active',
    'agile','busy','cheerful','charming','confident','creative','daring','dynamic','energetic',
    'faithful','fearless','focused','funny','graceful','helpful','honest','humble','inventive',
    'jolly','keen','lively','loyal','mighty','modern','neat','noble','optimistic','patient',
    'peaceful','powerful','practical','precise','quiet','rapid','reliable','resilient','robust',
    'serene','sincere','skillful','steady','thoughtful','tough','trusty','upbeat','vivid','warm',
    'witty','zesty',
  ] as const;

  const nouns = [
    'fox','bear','wolf','eagle','hawk','lion','tiger','panther','leopard','cheetah',
    'falcon','raven','owl','shark','whale','dolphin','otter','seal','horse','stallion',
    'mustang','bison','buffalo','deer','elk','moose','boar','ram','goat','sheep',
    'camel','llama','alpaca','monkey','ape','gorilla','baboon','panda','koala','kangaroo',
    'wallaby','badger','beaver','weasel','marten','squirrel','chipmunk','rabbit','hare','hedgehog',
    'porcupine','skunk','lynx','bobcat','cougar','jaguar','crocodile','alligator','lizard','gecko',
    'python','viper','cobra','turtle','tortoise','frog','toad','newt','sparrow','robin',
    'crow','magpie','swan','goose','heron','crane','stork','pelican','antelope','gazelle','oryx',
  ] as const;

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomString = Math.random().toString(36).slice(2, 7);

  return `${adj}-${noun}-${randomString}.igoshev.pro`;
}
