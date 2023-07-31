# Brillouin zone visualisation tool

## One sentence summary

This tool creates pretty 3D pictures which tell you something about how electrons behave in real world solid materials.

## Detailed overview

### What is a lattice?

In many solids, the atoms are arranged in a regular structure, called a lattice. Many different lattice structures are possible.

For example, imagine completely filling space with a load of identically sized, non-overlapping, cubes. If you put an atom at the corner of each cube, you would then have a **Cubic Lattice**.

Now suppose you *also* put an atom at the center of each cube. You would then have a **Body Centred Cubic Lattice (BCC)**.

If you instead added extra atoms in the middle of the faces of each cube, you would have a **Face Centred Cubic Lattice (FCC)**.

Or you might have a completely different sort of lattice. A **hexagonal** lattice consists of two dimensional planes, in layers, each plane filled with identical triangles, with atoms at the corners.

Many other lattice arrangements are possible.

We started by saying that it is the atoms in a solid which are arranged in a regular lattice structure, but really it's only the atomic nuclei that are held in place like this. The electrons are more mobile. But the way they move is influenced by the kind of lattice they are moving through. This tool helps to visualise how a particular lattice structure will affect the way that the electrons move through it.

### How do electrons move through a lattice?

The motion of electrons is governed by quantum mechanics, which describes how nature works at small length scales. It works pretty differently to the "classical" physics we are used to at every day length scales.

For example, in an atom, the electrons can't have just any energy. Their energy is *quantised*, which means that it can only take on certain discrete values, called *energy levels*. When the energy of an electron changes, it must discontinuously jump from one energy level to another. This is different to how things work in classical physics. Planets orbiting the sun can have any energy.

It is also different to how a *free* electron moves in quantum mechanics. If an electron is not bound to an atomic nucleus, then its energy can have any positive value, just like a free particle in classical physics.

When electrons move through a lattice, the situation is like something in between the bound case (with discrete energy levels) and the free case (where any positive energy value is allowed). In a lattice, the energy levels of the individual atoms get smeared out into energy *bands* of the lattice. An energy band corresponds to a range of possible energy values, rather than the single allowed value of an energy level. Electrons in the lattice can take any energy value within a band. However, at the edge of a band, there could be a discrete jump in energy to reach the next band.

The band structure of a lattice is really important for determing the properties of the material. For example, it determines whether a material will be a conductor or an insulator.

### Conductors vs Insulators

There are two important properties of electrons to understand here:

- Electrons are fermions, which means you cannot have more than one of them in the same quantum state.
- Electrons will try to occupy the lowest energy state that they can.

Strictly speaking, the second bullet point is only true when the temperature is sufficiently low. But in most materials, room temperature is already low enough for this heuristic to be valid.

The electrons will occupy the lower energy states first, but they can't all occupy the lowest energy state, so they pile up. Many energy bands will end up containing electrons. Which bands are filled, and how full they are, depends on what the band structure is, and how many electrons there are in total.

Now we are ready to give the crucial distinction between a conductor and an insulator: *in a conductor, the highest energy band is (typically) partially filled, while in an insulator, the highest energy band is (typically) completely filled*.

Why does this property determine whether a material will be conducting or not?

Consider a wire. Within each electron energy band, there will be some states that correspond to electrons moving right along the wire, and some states that correspond to electrons moving left along the wire. If there is no external electric field being applied, a right-moving state will have the same energy as the corresponding left-moving state. Since electrons fill up the lowest energy states first, this means either both states will be empty, or both will be filled. Overall, there will be no net current in one direction over the other. The two states make equal and opposite contributions to the current, which cancel out.

This changes when you apply an electric field to the wire (e.g. by connecting it to a plug socket). The electrons will now try to rearrange themselves among the available states to move preferentially in one direction, according to the direction of the applied field. If they are able to do that, we will get a net current moving along the wire.

In a partially filled energy band, this rearrangement is possible, even when an arbitrarily small electric field is applied. There are lots of unoccupied right-moving states within the energy band for the electrons to move into, leaving new vacant left-moving states behind, and giving rise to an overall net current. A material with a partially filled energy band is therefore a *conductor*.

However, if all the energy bands are either fully filled with electrons already, or completely empty, then there is no slack available. No rearrangement of the electrons among the energy states is possible if we only apply a small electric field. This means there will still be no net current overall. We will only see an electric current once we apply an electric field so large that electrons can jump across the gap to a higher energy band. This material is an *insulator*.

### Momentum space

We now almost have enough background to understand what the visualisations mean. The final concept we need is *momentum space*.

Momentum space is a way of visualising an electron's momentum. A particle's momentum actually consists of three numbers: the momentum along the x-direction, the momentum along the y-direction, and the momentum along the z-direction. If an electron had momentum (3,7,5) in the x, y, and z directions respectively, then in momentum space we would plot it at coordinates (x: 3, y: 7, z: 5).

If an electron has constant momentum, it would stay still at a certain point in momentum space. If the electron is accelerating so that its momentum is changing, then it would be moving around in momentum space.

The visualisations this tool produces are called 'Brillouin zones'. They are regions in momentum space. When you select some options on the left and see a surface appear on the right, that surface is a surface in momentum space. When we talk of electrons being inside or outside that surface, we are talking about their momentum being within or outside certain bounds.

### Weak lattice interactions

Brillouin zones tell you important things about how electrons move in a general lattice. But it is easiest to see the direct physical effect of these shapes in the special case when the effect of the lattice on the electrons is very weak.

If the electrons only interact weakly with the lattice, then they will behave similarly to free electrons, but with some small corrections.

Remember that free electrons can take on any positive energy value. If we imagine a free electron in momentum space, then as the momentum varies, the energy varies. The energy is 0 when the momentum is (0,0,0). As the momentum gets further away from this point, the energy increases continuously, ultimately taking on any positive value.

If the electrons are only weakly affected by the lattice, then their behaviour is almost the same. Except that now the energy does not vary continuously with momentum everywhere. There are certain places in momentum space where the energy undergoes a small discontinuous jump. These places represent the edge of an energy band.

The shapes you see in this tool represent the places in momentum space where the energy will undergo one of these jumps. When you plot the first brillouin zone, the shape you see shows the boundary between the first energy band and the next one. The energy will jump as the momentum crosses this threshold. The shape you see when plotting the second brillouin zone represents the boundary between the second and third energy band. There will be another small jump in energy here.

### Weak lattice interactions: band structure

How can we tell which bands will be completely filled with electrons, and which will be partially filled?

On the tool, you can select an option to display something called the 'fermi surface'. This is a surface in momentum space that shows which states will be occupied by electrons, and which will be unoccupied. States inside the fermi surface are occupied, and states outside the fermi surface are not.

The fermi surface that this tool plots is actually the fermi surface for a free electron. For free electrons, the energy depends only on the total magnitude of the momentum, so the fermi surface is a sphere. We rely on the weak lattice approximation to mean that this fermi surface is close to the actual fermi surface of electrons influenced by the lattice.

To plot the fermi sphere, you need to specify the 'valence'. This represents the number of electrons contributed by each atom.

If the nth Brillouin zone is completely hidden inside the fermi sphere, that means that the nth energy band will be completely filled. If the fermi sphere intersects the nth Brillouin zone, that means that the nth energy band will be partially filled. If the fermi sphere is hidden inside the nth Brillouin zone surface, then the nth energy band will be partially filled, or empty if the fermi sphere is hidden inside the (n-1)th Brillouin zone as well.

Since the fermi surface in a weak lattice is approximately spherical, while the Brillouin zones have flat faces, you will never have the highest energy band being completely filled within the weak lattice approximation. Instead, at least the top two energy bands will be partially filled. The energy values within each band are overlapping, because the discrete jump in energy at the Brillouin zone surface is only small.

This means we don't get insulating materials in the weak lattice picture.

### The general case: Strong lattice interactions and "crystal momentum"

When the lattice is strong, Brillouin zones are still very important, but we need to introduce one more concept to understand why: the 'crystal momentum'.

Momentum stops being such a useful thing to keep track of once the effect of the lattice become large. This is because it is no longer conserved.

There are two ways of understanding why momentum is no longer conserved, the straightforward way and the modern way. The straightforward way is that the electrons can now lose momentum by interacting with the fixed background lattice. The modern way is to understand that momentum conservation is associated with a symmetry in the laws of physics: translation invariance. The presence of the fixed lattice breaks that symmetry, and so momentum is no longer conserved.

But the lattice still has some kind of translation symmetry. If we shift everything by a whole lattice spacing, then everything still looks the same. It turns out that in quantum mechanics, this discrete symmetry still gives rise to a kind of conservation law. The conserved quantity is called the 'crystal momentum'. You can think of crystal momentum as being very similar to plain old momentum. It tells you something about how much the electrons are moving, and what direction they are heading in.

But there is an important difference between crystal momentum and the momentum we are used to. While momentum lives in momentum space and is unbounded, crystal momentum lives in a space more like that inhabited by Pacman. It lives in a finite bounded region. If it goes too far in one direction, and tries to leave the region, it pops back out of the opposite side of the region again.

In a strong lattice, the visualisations of this tool should be thought of as living in *crystal momentum space*, rather than *momentum space*. And the first Brillouin zone now marks the boundary of the entire crystal momentum space. The crystal momentum lives exclusively inside the first Brillouin zone. If it passes through one of the Brillouin zone faces, it pops back out of the opposite face, staying inside the zone.

### Physical consequences of crystal momentum periodicity

The previous section probably seemed very abstract. When we say the crystal momentum pops back out the other side of the Brillouin zone again, what are we actually talking about?

For simplicity, lets just think about the crystal momentum in a single direction, and forget the units for now. Lets say it has a periodicity of 20, meaning that it lives in the range \[-10,10\], and if it tries to go outside this range, it pops back out the opposite edge again.

Suppose we have two electrons, one with a crystal momentum of +8, and one with a crystal momentum of +9. The total crystal momentum is now 8+9 = -3. It is *not* 17, because that lives outside our crystal momentum space.

If the electrons collide, it is then perfectly consistent with crystal momentum conservation for their new crystal momenta to end up as -2 and -1. This is because (-2)+(-1) = -3 as well. In other words, the crystal momentum of each electron could now be in the other direction!

This kind of collision is known as [Umklapp scattering](https://en.wikipedia.org/wiki/Umklapp_scattering), and it is a real physical thing. For crystals with a 'low defect structure' (meaning the lattice is very regular), Umklapp scattering is the dominant source of electrical resistance at low temperatures.

The most striking impact of crystal momentum periodicity comes from [Bloch oscillations](https://en.wikipedia.org/wiki/Bloch_oscillation). If you manage to construct a material where the electrons experience hardly any scattering, and you apply a constant electric field, then instead of the current flowing in the direction of the applied field, it will actually oscillate back and forth, as the crystal momenta of the electrons keeps passing through the edge of the Brillouin zone and back out the other side again. But this effect is very hard to observe experimentally.

### Crystal momentum and band structure

The energy band structure we described above can also be understood as a consequence of the periodicity of crystal momentum.

The energy of a free electron can take any positive value up to infinity, as the momentum varies across the full range of the infinite momentum space it lives in. The energy of a lattice electron also varies continuously, with *crystal* momentum. But the crystal momentum does not live in an infinite space. It lives only in the first Brillouin zone, which is finite. As it varies across this zone, it only hits a finite *band* of energy values.

So the states of each energy band can be characterized by their crystal momenta, which live in a finite region called the first Brillouin zone. As the crystal momentum varies within this zone, the energy varies continuously within the band. If all states in the zone are filled, the band will be full. To characterize the state of an electron, we need to provide two things: a number to describe which energy band it lives in, and its crystal momentum, which determines where it sits within this band.

### Connection between the two pictures

What about the higher Brillouin zones? And how does this new picture connect with the weak lattice picture we described first, where we were still using all of momentum space?

The answer to these questions does not involve any new physics concepts, it's just a matter of conventions.

Lets go back to the one dimensional example with a crystal momentum of periodicity 20, living in \[-10,10\]. We could also have decided to have the crystal momentum living in the range \[10,30\] instead, if we had wanted to. It was already understood that the number +17 was to be considered equivalent to -3, so which particular way we decide to represent it is up to us.

Similarly, instead of having the crystal momenta living in the first Brillouin zone, we could have represented them in the *second* Brillouin zone. This zone is actually the space in between the surface you see if you plot the first Brillouin zone with the tool, and the surface you see if you plot the second.

The second Brillouin zone has the same volume as the first Brillouin zone. In fact, it turns out that all Brillouin zones have the same volume, and all of them could equally well be used to represent the region of space that the crystal momentum are confined to live in. Which one we decide to use is completely up to us.

So here is a convention that is used sometimes: we use the first Brillouin zone to represent the crystal momenta for the first energy band, and the second Brillouin zone to represent the crystal momenta for the second energy band, etc.

The advantage of this convention is that we no longer have to give two things to specify an electron's state (band number and crystal momentum), we instead just give the crystal momentum, with the understanding that the Brillouin zone it lives in is being used to represent the energy band.

This is just a convention, that is used in some cases and not others. But it turns out to be particularly suited to the case of a weak lattice. This is because it is in this representation that the close connection to the free electron case becomes explicit, as we saw. It is this representation in which we can plot a fermi sphere to understand the band structure.